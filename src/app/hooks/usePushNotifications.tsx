
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { useToast } from '@/app/hooks/use-toast';

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully:', registration);
      
      // Check if already subscribed
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        setSubscription(existingSubscription);
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        throw new Error('No service worker registration found');
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      const vapidKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI0DLLaMgoLKg-_2_lmWRhO3lCZOtZBKPFa1bFvl1rVJOgL6oL9Fk3q4cM'; // You'll need to generate this
      
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey,
      });

      setSubscription(pushSubscription);
      setIsSubscribed(true);

      // Store subscription in database
      // You can implement this later with Supabase

      toast({
        title: "התראות הופעלו",
        description: "תקבל התראות על משמרות חדשות ועדכונים",
      });

    } catch (error) {
      console.error('Push subscription failed:', error);
      toast({
        title: "שגיאה בהפעלת התראות",
        description: "לא הצלחנו להפעיל התראות. נסה שוב מאוחר יותר.",
        variant: "destructive",
      });
    }
  };

  const unsubscribeFromPush = async () => {
    try {
      if (subscription) {
        await subscription.unsubscribe();
        setSubscription(null);
        setIsSubscribed(false);
        
        toast({
          title: "התראות בוטלו",
          description: "לא תקבל עוד התראות מהאפליקציה",
        });
      }
    } catch (error) {
      console.error('Unsubscribe failed:', error);
    }
  };

  return {
    isSupported,
    isSubscribed,
    subscription,
    subscribeToPush,
    unsubscribeFromPush,
  };
};
