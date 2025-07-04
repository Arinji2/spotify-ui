// Package cache provides a simple in-memory cache implementation.
package cache

import (
	"sync"
	"time"
)

type CacheItem struct {
	Value      []byte
	Expiration int64
}

type InMemoryCache struct {
	mu    sync.RWMutex
	items map[string]CacheItem
}

func NewInMemoryCache() *InMemoryCache {
	return &InMemoryCache{
		items: make(map[string]CacheItem),
	}
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
}
