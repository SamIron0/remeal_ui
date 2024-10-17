import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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

interface FilterOptions {
  maxCookTime: number | null;
}

interface FilterProps {
  options: FilterOptions;
  onChange: (newOptions: FilterOptions) => void;
}

const RecipeFilter: React.FC<FilterProps> = ({ options, onChange }: FilterProps) => {
  const [localOptions, setLocalOptions] = useState<FilterOptions>(options);

  useEffect(() => {
    const savedOptions = localStorage.getItem("filterOptions");
    if (savedOptions) {
      const parsedOptions = JSON.parse(savedOptions);
      setLocalOptions(parsedOptions);
    }
  }, []);

  const handleMaxCookTimeChange = (value: number[]) => {
    setLocalOptions((prevOptions: FilterOptions) => ({
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
      <DialogTrigger asChild className="border-none h-8 w-8 hover:bg-transparent hover:text-black shadow-none rounded-full">
        <Button className="px-2" variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <>
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
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
      </DialogContent>
    </Dialog>
  );
};

export default RecipeFilter;
