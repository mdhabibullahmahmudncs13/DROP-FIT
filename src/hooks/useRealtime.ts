'use client';

import { useEffect, useRef } from 'react';
import { client, DATABASE_ID } from '@/lib/appwrite/client';

type RealtimeCallback = (payload: unknown) => void;

export function useRealtime(
  collectionId: string,
  documentId: string | null,
  callback: RealtimeCallback
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!documentId) return;

    const channel = `databases.${DATABASE_ID}.collections.${collectionId}.documents.${documentId}`;

    const unsubscribe = client.subscribe(channel, (response) => {
      callbackRef.current(response.payload);
    });

    return () => {
      unsubscribe();
    };
  }, [collectionId, documentId]);
}

export function useRealtimeCollection(
  collectionId: string,
  callback: RealtimeCallback
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const channel = `databases.${DATABASE_ID}.collections.${collectionId}.documents`;

    const unsubscribe = client.subscribe(channel, (response) => {
      callbackRef.current(response.payload);
    });

    return () => {
      unsubscribe();
    };
  }, [collectionId]);
}
