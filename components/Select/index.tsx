import React, { useState, useRef, useEffect, ChangeEvent } from "react";

import clsx from "clsx";
import { ChevronDown, X, Search, Loader2, CheckIcon } from "lucide-react";

import Button from "../Button";

export interface KeyValueData<V = number, L = string> {
  label: L;
  value: V;
}

export interface SelectProps<V = string> {
  options: KeyValueData<V>[];
  value?: V[];
  onChange?: (selectedOptions: V[]) => void;
  placeholder?: string;
  isLoading?: boolean;
  isSearchable?: boolean;
  isClearable?: boolean;
  label?: string;
  type?: "single" | "multi";
  onSearch?: (
    e: ChangeEvent<HTMLInputElement>,
    selectedOpts: KeyValueData<V>[]
  ) => void;
  containerClassName?: string;
}

const Select = <V = string,>({
  options = [],
  value = [],
  onChange,
  placeholder = "Select...",
  isLoading = false,
  isSearchable = false,
  isClearable = false,
  label,
  type = "single",
  onSearch,
  containerClassName = "",
}: SelectProps<V>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOptions = options.filter((option) =>
    value.some((v) => JSON.stringify(v) === JSON.stringify(option.value))
  );

  const handleOptionSelect = (optionValue: V) => {
    if (!onChange) return;

    if (type === "single") {
      onChange([optionValue]);
      setIsOpen(false);
    } else {
      const isSelected = value.some(
        (v) => JSON.stringify(v) === JSON.stringify(optionValue)
      );
      const newValue = isSelected
        ? value.filter((v) => JSON.stringify(v) !== JSON.stringify(optionValue))
        : [...value, optionValue];
      onChange(newValue);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e, selectedOptions);
    }
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange) {
      onChange([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && isSearchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, isSearchable]);

  const renderSelectedValue = () => {
    if (value.length === 0) {
      return <span className="text-gray-500 truncate">{placeholder}</span>;
    }

    return (
      <div className="flex justify-between items-center">
        <span className="text-primary px-2 py-1 rounded text-sm">
          {selectedOptions.length} selected
        </span>
        {selectedOptions.length > 0 && isClearable && (
          <Button
            onClick={handleClearAll}
            className="text-gray-400 hover:text-gray-600 p-0.5"
            title="Clear all"
          >
            <X size={14} />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className={clsx("w-full", containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div ref={selectRef} className="relative">
        {/* Select Trigger */}
        <div
          onClick={() => !isLoading && setIsOpen(!isOpen)}
          className={`
            w-full min-h-[42px] px-3 py-2 border border-gray-300 rounded-md bg-white
            flex items-center justify-between cursor-pointer transition-colors
            ${
              isLoading
                ? "cursor-not-allowed opacity-50"
                : "hover:border-gray-400"
            }
            ${isOpen ? "border-primary ring-1 ring-primary" : ""}
          `}
        >
          <div className="flex-1 min-w-0 text-sm font-medium">
            {renderSelectedValue()}
          </div>

          <div className="flex items-center gap-2 ml-2">
            {isLoading && (
              <Loader2 size={16} className="animate-spin text-gray-400" />
            )}
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
            {/* Search Input */}
            {isSearchable && (
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-gray-500 text-sm">
                  {searchTerm ? "No results found" : "No options available"}
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = value.some(
                    (v) => JSON.stringify(v) === JSON.stringify(option.value)
                  );

                  return (
                    <div
                      key={`${option.value}-${index}`}
                      onClick={() => handleOptionSelect(option.value)}
                      className={`
                        px-3 py-2 cursor-pointer flex items-center justify-between
                        hover:bg-gray-50 transition-colors
                        ${
                          isSelected
                            ? "bg-blue-50 text-primary"
                            : "text-gray-700"
                        }
                      `}
                    >
                      <span className="truncate text-sm">{option.label}</span>
                      {type === "multi" && isSelected && (
                        <CheckIcon className="h-4 w-6" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Select;
