import { ChangeEvent, useState } from "react";

import Input from "./Input";
import { Search as SearchIcon } from "lucide-react";

interface Props {
  onSearch: (value: string) => void;
}

const Search = (props: Props) => {
  const { onSearch } = props;

  const [input, setInput] = useState("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search..."
        className="w-full px-10 py-1.5 border border-primary"
        value={input}
        onChange={handleInputChange}
      />
      <SearchIcon className="absolute left-2 top-2 text-gray-500" />
    </div>
  );
};

export default Search;
