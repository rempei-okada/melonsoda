function schemeDef(db: IDBDatabase, name: string, keyName: string) {
    db.createObjectStore(name, { keyPath: keyName });
}

function connect(dbname: string, version: number, schemes: CreateSchemeParams[]): Promise<IDBDatabase> {
    const dbp = new Promise<IDBDatabase>((resolve, reject) => {
        const req = window.indexedDB.open(dbname, version);
        req.onsuccess = (ev: any) => resolve(ev.target.result as IDBDatabase);
        req.onerror = (ev: any) => reject('fails to open db');
        req.onupgradeneeded = (ev: any) => {
            for (const scheme of schemes) {
                schemeDef(ev.target.result as any, scheme.schemeName, scheme.keyName);
            }
        };
    });
    dbp.then((d: any) => d.onerror = (ev: any) => alert("error: " + ev.target.errorCode));
    return dbp;
}

type Scheme = "notes" | "pages";

interface CreateSchemeParams {
    schemeName: Scheme;
    keyName: string;
}

class DatabaseProvider {
    private idb: IDBDatabase | null = null;

    public async connect() {
        this.idb = await connect("melonsoda", 1, [
            { keyName: "noteId", schemeName: "notes" },
        ]);
    }

    save<T>(scheme: Scheme, obj: T): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const docs = this.idb!.transaction(scheme, 'readwrite').objectStore(scheme);
            const req = docs.put(obj);
            req.onsuccess = () => resolve({ ...obj });
            req.onerror = reject;
        });
    }

    remove(scheme: Scheme, id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const docs = this.idb!.transaction(scheme, 'readwrite').objectStore(scheme);
            const req = docs.delete(id);
            req.onsuccess = () => resolve();
            req.onerror = reject;
        });
    }

    load<T>(scheme: Scheme, id: string): Promise<T | null> {
        return new Promise<T | null>((resolve, reject) => {
            const docs = this.idb!.transaction(scheme).objectStore(scheme);
            const req = docs.get(id);
            req.onsuccess = () => resolve(req.result ?? null);
            req.onerror = reject;
        });
    }

    loadAll<T>(scheme: Scheme): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            const docs = this.idb!.transaction(scheme).objectStore(scheme);
            const req = docs.getAll();
            req.onsuccess = () => resolve(req.result ?? []);
            req.onerror = reject;
        });
    }
}

export const database = new DatabaseProvider();
database.connect();
