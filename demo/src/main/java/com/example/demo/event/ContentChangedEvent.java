package com.example.demo.event;

public record ContentChangedEvent(String type, String slug, String oldSlug, String categorySlug) {
    public ContentChangedEvent(String type, String slug) {
        this(type, slug, null, null);
    }

    public ContentChangedEvent(String type, String slug, String oldSlug) {
        this(type, slug, oldSlug, null);
    }
}
