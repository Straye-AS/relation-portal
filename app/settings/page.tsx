"use client";

import { AppLayout } from "@/components/layout/app-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/useUIStore";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useUIStore();

  const handleSave = () => {
    toast.success("Innstillinger lagret");
  };

  return (
    <AppLayout disableScroll>
      <div className="flex h-full flex-col">
        <div className="flex-none border-b bg-background px-4 py-4 md:px-8">
          <div>
            <h1 className="text-3xl font-bold">Innstillinger</h1>
            <p className="text-muted-foreground">
              Administrer dine preferanser og applikasjonsinnstillinger
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="max-w-4xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Utseende</CardTitle>
                <CardDescription>
                  Tilpass hvordan applikasjonen ser ut
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base">Tema</Label>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Velg fargetema for applikasjonen
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      className="flex h-24 flex-col gap-2"
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="h-6 w-6" />
                      Lys
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      className="flex h-24 flex-col gap-2"
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="h-6 w-6" />
                      Mørk
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      className="flex h-24 flex-col gap-2"
                      onClick={() => setTheme("system")}
                    >
                      <Monitor className="h-6 w-6" />
                      System
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Språk</CardTitle>
                <CardDescription>
                  Velg språk for brukergrensesnittet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="lang-no" className="text-base">
                      Norsk
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Standardspråk
                    </p>
                  </div>
                  <Switch
                    id="lang-no"
                    checked={language === "no"}
                    onCheckedChange={(checked) => {
                      if (checked) setLanguage("no");
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="lang-en" className="text-base">
                      English
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Alternative language
                    </p>
                  </div>
                  <Switch
                    id="lang-en"
                    checked={language === "en"}
                    onCheckedChange={(checked) => {
                      if (checked) setLanguage("en");
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Varsler</CardTitle>
                <CardDescription>
                  Konfigurer hvordan du vil motta varsler
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notif" className="text-base">
                      E-postvarsler
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Motta varsler på e-post
                    </p>
                  </div>
                  <Switch id="email-notif" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notif" className="text-base">
                      Push-varsler
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Motta nettleserpush-varsler
                    </p>
                  </div>
                  <Switch id="push-notif" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="offer-notif" className="text-base">
                      Tilbudsvarsler
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Få varsler når tilbud oppdateres
                    </p>
                  </div>
                  <Switch id="offer-notif" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="project-notif" className="text-base">
                      Prosjektvarsler
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Få varsler om prosjektendringer
                    </p>
                  </div>
                  <Switch id="project-notif" defaultChecked />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button variant="outline">Avbryt</Button>
              <Button onClick={handleSave}>Lagre innstillinger</Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
