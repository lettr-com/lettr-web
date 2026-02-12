export interface TimeSlot {
	calendarId: number;
	start: string;
	end: string;
	readableType: string;
	seats: number;
	title: string;
}

export interface Location {
	type: string;
	value: string;
	default?: boolean;
}

export type CustomFieldValue = string | number | boolean | string[];

export interface CustomFieldCollected {
	uuid: string;
	value?: CustomFieldValue;
}

export interface ReservationUser {
	uuid: string;
	userId: number;
	userName: string;
	userEmail: string;
}

export interface ReservationResponse {
	success: boolean;
	data: ReservationUser;
}

export interface InitConfiguration {
	apiBaseUrl?: string;
	redirectAfterBookingUrl?: string;
	hideLocation?: boolean;
}

export interface InitData {
	configuration: InitConfiguration;
	disabled: boolean;
	locations?: Location[];
	eventTypeName: string;
}

export interface InitResponse {
	success: boolean;
	data: InitData;
}

export interface AvailableTimeSlotsResponse {
	success: boolean;
	data: TimeSlot[];
}

export interface ZaptimeErrorResponse {
	success: false;
	error: string;
}

export interface ReservationPayload {
	email: string;
	timeSlot: TimeSlot;
	timezone: string;
	firstName?: string;
	lastName?: string;
	seats?: number;
	phone?: string;
	location?: Location;
	customFields?: CustomFieldCollected[];
}
