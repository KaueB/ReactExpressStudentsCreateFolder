import { useState } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Label } from '@radix-ui/react-label';

const occupations = [
    { display: "Aluno", value: "student" },
    { display: "Professor", value: "teacher" }
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

interface SelectOccupationProps {
    onOccupationChange: (occupation: string) => void;
}

export default function SelectOccupation({ onOccupationChange }: SelectOccupationProps) {
    const [selected, setSelected] = useState(occupations[0]);

    const handleChange = (value: { display: string, value: string }) => {
        setSelected(value);
        onOccupationChange(value.value);
    };

    return (
        <Listbox value={selected} onChange={handleChange}>
            {({ open }) => (
                <>
                    <Label>Ocupação</Label>
                    <div className="relative mt-0">
                        <ListboxButton className="relative w-full cursor-default rounded-md py-1.5 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                            <span className="flex items-center">
                                <span className="ml-2 block truncate">{selected.display}</span>
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                        </ListboxButton>

                        <Transition show={open} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {occupations.map((occupation) => (
                                    <ListboxOption
                                        key={occupation.value}
                                        className={({ focus }) =>
                                            classNames(
                                                focus ? 'bg-gray-300 text-gray-900' : '',
                                                !focus ? 'bg-gray-800' : '',
                                                'relative cursor-default select-none py-2 pl-3 pr-9'
                                            )
                                        }
                                        value={occupation}
                                    >
                                        {({ selected, focus }) => (
                                            <>
                                                <div className="flex items-center">
                                                    <span
                                                        className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                                    >
                                                        {occupation.display}
                                                    </span>
                                                </div>

                                                {selected ? (
                                                    <span
                                                        className={classNames(
                                                            focus ? 'text-white' : 'text-indigo-600',
                                                            'absolute inset-y-0 right-0 flex items-center pr-4'
                                                        )}
                                                    >
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </ListboxOption>
                                ))}
                            </ListboxOptions>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    );
}
