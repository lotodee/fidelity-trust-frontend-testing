"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, CreditCard, Wallet } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CardData {
  id: number;
  name: string;
  number: string;
  expiry: string;
  balance: string;
}

export default function Cards() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    name: "",
    number: "",
    expiry: "",
    balance: "0.00",
  });
  const { toast } = useToast();

  const handleAddCard = () => {
    if (!newCard.name || !newCard.number || !newCard.expiry) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all card details.",
      });
      return;
    }

    const card: CardData = {
      id: Date.now(),
      ...newCard,
    };

    setCards([...cards, card]);
    setShowAddCard(false);
    setNewCard({
      name: "",
      number: "",
      expiry: "",
      balance: "0.00",
    });

    toast({
      title: "Card Added",
      description: "Your new card has been added successfully.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Cards</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Card
              key={card.id}
              className="bg-gradient-to-br from-navy-800 to-navy-950 text-white overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-8">
                  <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="font-bold text-white text-sm">N</span>
                  </div>
                  <CreditCard className="h-6 w-6 text-white/80" />
                </div>

                <div className="mb-6">
                  <div className="text-lg font-mono">{card.number}</div>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs text-white/70 mb-1">
                      CARD HOLDER
                    </div>
                    <div>{card.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/70 mb-1">EXPIRES</div>
                    <div>{card.expiry}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-white/5 p-4">
                <div className="w-full flex justify-between items-center">
                  <div>
                    <div className="text-xs text-white/70">
                      AVAILABLE BALANCE
                    </div>
                    <div className="text-lg font-semibold">{card.balance}</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white bg-white/10"
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      Fund
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}

          <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
            <DialogTrigger asChild>
              <Card className="border-dashed border-2 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-colors cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center h-full py-10">
                  <Plus className="h-10 w-10 text-gray-400" />
                  <p className="mt-2 text-gray-500 font-medium">Add New Card</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Card</DialogTitle>
                <DialogDescription>
                  Enter your card details to create a new virtual card.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="cardName">Card Holder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={newCard.name}
                    onChange={(e) =>
                      setNewCard({ ...newCard, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="**** **** **** 1234"
                    value={newCard.number}
                    onChange={(e) =>
                      setNewCard({ ...newCard, number: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={newCard.expiry}
                    onChange={(e) =>
                      setNewCard({ ...newCard, expiry: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="initialBalance">Initial Balance</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      id="initialBalance"
                      type="number"
                      placeholder="0.00"
                      className="pl-8"
                      value={newCard.balance}
                      onChange={(e) =>
                        setNewCard({ ...newCard, balance: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  className="bg-emerald-500 hover:bg-emerald-600"
                  onClick={handleAddCard}
                >
                  Create Card
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </DashboardLayout>
  );
}
