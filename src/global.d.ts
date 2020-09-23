// src/global.d.ts
declare module '*.graphql' {
    import { DocumentNode } from 'graphql';

    const value: DocumentNode;
    export = value;
}

declare module 'configuration-master'
