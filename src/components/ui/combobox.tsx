import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxProps {
    items?: { value: string; label: string }[]
    value?: string
    onChange: (value: string) => void
    placeholder?: string
    searchPlaceholder?: string
    emptyText?: string
    onSearch?: (query: string) => Promise<any[]>
    allowCustom?: boolean
    labelKey?: string
    valueKey?: string
    disabled?: boolean
}

export function Combobox({
    items: initialItems = [],
    value,
    onChange,
    placeholder = "Select...",
    searchPlaceholder = "Search...",
    emptyText = "No results found.",
    onSearch,
    allowCustom = false,
    labelKey = 'name',
    valueKey = '_id',
    disabled = false,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [internalItems, setInternalItems] = React.useState<{ value: string; label: string }[]>(initialItems)
    const [loading, setLoading] = React.useState(false)

    // Merge static items with internal items if provided, but internal items take precedence when searching
    const items = onSearch ? internalItems : initialItems

    React.useEffect(() => {
        if (onSearch) {
            setLoading(true)
            const timer = setTimeout(() => {
                onSearch(query)
                    .then((data) => {
                        const mapped = data.map((item: any) => ({
                            value: item[valueKey] || item.value,
                            label: item[labelKey] || item.label,
                        }))
                        setInternalItems(mapped)
                    })
                    .catch(() => setInternalItems([]))
                    .finally(() => setLoading(false))
            }, 300)
            return () => clearTimeout(timer)
        }
    }, [query, onSearch, valueKey, labelKey])

    const handleSelect = (currentValue: string) => {
        onChange(currentValue === value ? "" : currentValue)
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    {value
                        ? items.find((item) => item.value === value)?.label || value
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command shouldFilter={!onSearch}>
                    <CommandInput placeholder={searchPlaceholder} onValueChange={setQuery} />
                    <CommandList>
                        <CommandEmpty>
                            {loading ? (
                                <div className="p-2 text-sm text-center text-muted-foreground">Loading...</div>
                            ) : allowCustom && query ? (
                                <div className="p-2 cursor-pointer text-sm" onClick={() => handleSelect(query)}>
                                    Create "{query}"
                                </div>
                            ) : emptyText}
                        </CommandEmpty>
                        <CommandGroup>
                            {items.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    value={item.label}
                                    onSelect={() => handleSelect(item.value)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === item.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {item.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
