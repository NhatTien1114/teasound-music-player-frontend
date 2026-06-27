import { Search } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
}

export default function SearchInput({
  placeholder = "Search for artists, songs and ...",
  className = "",
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-grayDark" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full bg-grayDarker rounded-full py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-grayDark outline-none border border-white/5 focus:border-secondary/30 transition-all duration-300"
      />
    </div>
  );
}
