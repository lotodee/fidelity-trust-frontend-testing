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
import { Plus, CreditCard, Wallet, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

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
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Cards</h1>
            <p className="text-gray-500 mt-1">Manage your virtual cards</p>
          </div>
          <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-500 hover:bg-emerald-600">
                <Plus className="h-4 w-4 mr-2" />
                Add New Card
              </Button>
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

        {cards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center"
          >
            <div className="rounded-full bg-gray-100 p-6 mb-4">
              <CreditCard className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Cards Yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm">
              Create your first virtual card to start making secure online
              purchases
            </p>
            <Button
              className="bg-emerald-500 hover:bg-emerald-600"
              onClick={() => setShowAddCard(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Card
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-navy-800 to-navy-950 text-white overflow-hidden">
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
                        <div className="text-xs text-white/70 mb-1">
                          EXPIRES
                        </div>
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
                        <div className="text-lg font-semibold">
                          {card.balance}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <Wallet className="h-4 w-4 mr-2" />
                          Fund
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
