import { BooleanSchema } from "yup";
import { Profile } from "./Profile";

export interface Activity {
    id: string,
    title: string,
    date: Date | null,
    category: string,
    description: string,
    city: string,
    venue: string,
    hostUsername?: string;
    isCancelled?: boolean;
    isGoing: boolean;
    isHost: boolean;
    host?: Profile
    attendees:  Profile[];
}
