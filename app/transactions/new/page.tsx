"use client"
import HeroSection from "./components/HeroSection";
import DescriptionSection from "./components/DescriptionSection";
import TransactionForm from "./components/TransactionForm";

export default function NewTransactionPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      <HeroSection />
      <DescriptionSection />
      <TransactionForm />
    </div>
  );
}