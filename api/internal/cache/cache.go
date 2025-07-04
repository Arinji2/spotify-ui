// Package cache provides a simple in-memory cache implementation with persistence.
package cache

import (
	"encoding/json"
	"os"
	"sync"
	"time"
)

type CacheItem struct {
	Value      []byte `json:"value"`
	Expiration int64  `json:"expiration"`
}

type InMemoryCache struct {
	mu       sync.RWMutex
	items    map[string]CacheItem
	filePath string
}

func NewInMemoryCache() *InMemoryCache {
	cache := &InMemoryCache{
		items:    make(map[string]CacheItem),
		filePath: "cache.json",
	}
	cache.loadFromFile()
	return cache
}

func (c *InMemoryCache) Get(key string) ([]byte, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	item, found := c.items[key]
	if !found || time.Now().UnixNano() > item.Expiration {
		return nil, false
	}

	return item.Value, true
}

func (c *InMemoryCache) Set(key string, value []byte, duration time.Duration) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.items[key] = CacheItem{
		Value:      value,
		Expiration: time.Now().Add(duration).UnixNano(),
	}
	c.saveToFile()
}

func (c *InMemoryCache) saveToFile() {
	data, err := json.MarshalIndent(c.items, "", "  ")
	if err != nil {
		return
	}
	_ = os.WriteFile(c.filePath, data, 0644)
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
