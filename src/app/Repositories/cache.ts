
export class ImageCacheRepository {
    async saveAsync(file: File) {
        const cache = await caches.open("images");
        await cache.put(file.name, new Response(file));
    }

    async loadAsContentUrlAsync(key: string) {
        try {
            const cache = await caches.open("images");
            const r = await cache.match(key);
            const blob = await r?.blob();
            return URL.createObjectURL(blob);
        }
        catch {
            return "";
        }
    }
}