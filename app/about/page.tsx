"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";


export default function AboutPage() {
  const [user, setUser] = useState<any>(null);
  
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

 

  

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        
        // Get user's subscription
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", session.user.id)
          .single();
        
        if (!error && data) {
          
        }
      }
      
      setLoading(false);
    }
    
    getUser();
  }, [supabase]);

  
   


  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl md:text-4xl mb-4">About Us</h1>
          <p className="text-muted-foreground">
            We are a team of developers who are passionate about building products that help people live better lives.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}