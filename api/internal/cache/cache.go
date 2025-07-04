// Package cache provides a simple in-memory cache implementation with persistence.
package cache

import (
	"encoding/json"
	"os"
	"sync"
	"time"

	"github.com/arinji2/spotify-ui-api/internal/logx"
)

const DefaultCacheDuration = 24 * time.Hour

type CacheItem struct {
	Value      []byte `json:"value"`
	Expiration int64  `json:"expiration"`
}

type InMemoryCache struct {
	mu        sync.RWMutex
	items     map[string]CacheItem
	filePath  string
	needsSave bool
}

func NewInMemoryCache() *InMemoryCache {
	cache := &InMemoryCache{
		items:    make(map[string]CacheItem),
		filePath: "cache.json",
	}
	cache.loadFromFile()

	interval := time.Minute * 30
	if os.Getenv("DEBUG") == "true" {
		logx.Debug("Enabled Debug Caching")
		interval = time.Second * 1
	}
	ticker := time.NewTicker(interval)
	go func() {
		for range ticker.C {
			cache.mu.RLock()
			needsSave := cache.needsSave
			cache.mu.RUnlock()

			if needsSave {
				cache.SaveToFile()
			}
		}
	}()
	return cache
}

func (c *InMemoryCache) Get(key Key) ([]byte, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	item, found := c.items[key.K]
	if !found || time.Now().UnixNano() > item.Expiration {
		return nil, false
	}

	return item.Value, true
}

func (c *InMemoryCache) Set(key Key, value []byte, duration time.Duration) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.items[key.K] = CacheItem{
		Value:      value,
		Expiration: time.Now().Add(duration).UnixNano(),
	}
	c.needsSave = true
}

func (c *InMemoryCache) SaveToFile() {
	c.mu.Lock()
	defer c.mu.Unlock()
	logx.Debug("Saving cache to file")
	now := time.Now().UnixNano()
	clean := map[string]CacheItem{}
	for k, v := range c.items {
		if v.Expiration > now {
			clean[k] = v
		}
	}
	data, err := json.MarshalIndent(clean, "", "  ")
	if err != nil {
		return
	}
	_ = os.WriteFile(c.filePath, data, 0644)

	c.needsSave = false
}

func (c *InMemoryCache) loadFromFile() {
	data, err := os.ReadFile(c.filePath)
	if err != nil {
		return // File not found or unreadable; start with empty cache
	}
	var saved map[string]CacheItem
	if err := json.Unmarshal(data, &saved); err != nil {
		return
	}
	c.items = saved
}
