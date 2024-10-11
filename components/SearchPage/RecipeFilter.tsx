import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useApp } from "@/context/AppContext";
import Link from "next/link";

interface FilterOptions {
  maxCookTime: number | null;
}

interface FilterProps {
  options: FilterOptions;
  onChange: (newOptions: FilterOptions) => void;
}

const RecipeFilter: React.FC<FilterProps> = ({ options, onChange }) => {
  const [localOptions, setLocalOptions] = useState<FilterOptions>(options);
  const { subscription } = useApp();
  const isPremium =
    subscription?.status === "active" || subscription?.status === "trialing";

  useEffect(() => {
    const savedOptions = localStorage.getItem("filterOptions");
    if (savedOptions) {
      const parsedOptions = JSON.parse(savedOptions);
      setLocalOptions(parsedOptions);
    }
  }, []);

  const handleMaxCookTimeChange = (value: number[]) => {
    setLocalOptions((prevOptions) => ({
      ...prevOptions,
      maxCookTime: value[0],
    }));
  };

  const applyFilters = () => {
    onChange(localOptions);
    localStorage.setItem("filterOptions", JSON.stringify(localOptions));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="px-2" variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {isPremium ? (
          <>
            <DialogHeader>
              <DialogTitle>Advanced Filters</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Max Cook Time: {localOptions.maxCookTime} minutes
                </label>
                <Slider
                  value={
                    localOptions.maxCookTime !== null
                      ? [localOptions.maxCookTime]
                      : [120]
                  }
                  onValueChange={handleMaxCookTimeChange}
                  max={120}
                  step={5}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={applyFilters}>Apply Filters</Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Upgrade to Premium</DialogTitle>
            </DialogHeader>
            <div className="py-6">
              <p className="text-center mb-4">
                Unlock advanced filters and more features with our Premium plan!
              </p>
              <Link href="/membership">
                <Button className="w-full">Upgrade Now</Button>
              </Link>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RecipeFilter;
