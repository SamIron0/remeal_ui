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
  dietaryRestrictions: string[];
  maxCookTime: number | null;
  minRating: number | null;
}

interface FilterProps {
  options: FilterOptions;
  onChange: (newOptions: FilterOptions) => void;
}

const RecipeFilter: React.FC<FilterProps> = ({ options, onChange }) => {
  const [localOptions, setLocalOptions] = useState<FilterOptions>(options);
  const { subscription } = useApp();
  const isPremium = subscription?.status === "active" || subscription?.status === "trialing";

  useEffect(() => {
    const savedOptions = localStorage.getItem("filterOptions");
    if (savedOptions) {
      const parsedOptions = JSON.parse(savedOptions);
      setLocalOptions(parsedOptions);
    }
  }, []);

  const handleDietaryRestrictionChange = (restriction: string) => {
    const updatedRestrictions = localOptions.dietaryRestrictions.includes(
      restriction
    )
      ? localOptions.dietaryRestrictions.filter((r) => r !== restriction)
      : [...localOptions.dietaryRestrictions, restriction];

    setLocalOptions((prevOptions) => ({
      ...prevOptions,
      dietaryRestrictions: updatedRestrictions,
    }));
  };

  const handleMaxCookTimeChange = (value: number[]) => {
    setLocalOptions((prevOptions) => ({
      ...prevOptions,
      maxCookTime: value[0],
    }));
  };

  const handleMinRatingChange = (value: number[]) => {
    setLocalOptions((prevOptions) => ({
      ...prevOptions,
      minRating: value[0],
    }));
  };

  const applyFilters = () => {
    onChange(localOptions);
    localStorage.setItem("filterOptions", JSON.stringify(localOptions));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Filters
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
                <label className="text-sm font-medium">Dietary Restrictions</label>
                {["vegetarian", "vegan", "gluten-free", "dairy-free"].map(
                  (restriction) => (
                    <label
                      key={restriction}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        checked={localOptions.dietaryRestrictions.includes(
                          restriction
                        )}
                        onCheckedChange={() =>
                          handleDietaryRestrictionChange(restriction)
                        }
                      />
                      <span className="capitalize">{restriction}</span>
                    </label>
                  )
                )}
              </div>
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
              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Min Rating: {localOptions.minRating}
                </label>
                <Slider
                  value={
                    localOptions.minRating !== null ? [localOptions.minRating] : [0]
                  }
                  onValueChange={handleMinRatingChange}
                  max={5}
                  step={0.5}
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
