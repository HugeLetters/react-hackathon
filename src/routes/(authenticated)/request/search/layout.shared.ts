import type { HelpRequest } from "@lib/api/request";
import {
	type QueryModel,
	type QueryModelValue,
	defineQueryModel,
} from "@lib/state/query";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

export type Nullish<T> = Exclude<T, undefined> | null;

type RequestRequirements = NonNullable<HelpRequest["helperRequirements"]>;

export const ReuseRequestModel = {
	"~reuseRequest": defineQueryModel<boolean>({
		transform: {
			from(param) {
				switch (param) {
					case "true":
						return true;
					default:
						return false;
				}
			},
			to(value) {
				switch (value) {
					case true:
						return "true";
					default:
						return "";
				}
			},
		},
	}),
} satisfies QueryModel;

export const FilterModel = {
	requester: defineQueryModel<Nullish<HelpRequest["requesterType"]>>({
		transform: {
			from(param) {
				switch (param) {
					case "person":
						return "person";
					case "organization":
						return "organization";
					default:
						return null;
				}
			},
			to(value) {
				return value || "";
			},
		},
	}),
	help: defineQueryModel<Nullish<HelpRequest["helpType"]>>({
		transform: {
			from(param) {
				switch (param) {
					case "finance":
						return "finance";
					case "material":
						return "material";
					default:
						return null;
				}
			},
			to(value) {
				return value || "";
			},
		},
	}),
	until: defineQueryModel<Nullish<Dayjs>>({
		transform: {
			from(param) {
				if (!param) {
					return null;
				}

				const date = dayjs(param, "DD-MM-YYYY");

				if (!date.isValid()) {
					return null;
				}

				return date;
			},
			to(value) {
				return value?.format("DD-MM-YYYY") ?? "";
			},
		},
	}),
	helper: defineQueryModel<Nullish<RequestRequirements["helperType"]>>({
		transform: {
			from(param) {
				switch (param) {
					case "group":
						return "group";
					case "single":
						return "single";
					default:
						return null;
				}
			},
			to(value) {
				return value || "";
			},
		},
	}),
	isOnline: defineQueryModel<Nullish<RequestRequirements["isOnline"]>>({
		transform: {
			from(param) {
				switch (param) {
					case "true":
						return true;
					case "false":
						return false;
					default:
						return null;
				}
			},
			to(value) {
				switch (value) {
					case true:
						return "true";
					case false:
						return "false";
					default:
						return "";
				}
			},
		},
	}),
	qualification: defineQueryModel<
		Nullish<RequestRequirements["qualification"]>
	>({
		transform: {
			from(param) {
				switch (param) {
					case "common":
						return "common";
					case "professional":
						return "professional";
					default:
						return null;
				}
			},
			to(value) {
				return value || "";
			},
		},
	}),
} satisfies QueryModel;

export const SearchModel = {
	q: defineQueryModel({
		transform: {
			from: String,
			to(s) {
				return s.toLowerCase();
			},
		},
	}),
} satisfies QueryModel;

export const PageModel = {
	page: defineQueryModel({
		transform: {
			from(param) {
				const parsed = Number.parseInt(param);
				if (Number.isNaN(parsed)) {
					return 1;
				}

				return parsed;
			},
			to(value) {
				return value.toString();
			},
		},
	}),
} satisfies QueryModel;

export type FilterModelValue = QueryModelValue<typeof FilterModel>;
export type SearchModelValue = QueryModelValue<typeof SearchModel>;
export interface FullFilter extends FilterModelValue, SearchModelValue {}

export function isFilterEmpty(filter: Partial<FullFilter>) {
	return (
		filter.help == null &&
		filter.helper == null &&
		filter.isOnline == null &&
		(filter.q === "" || filter.q === undefined) &&
		filter.qualification == null &&
		filter.requester == null &&
		filter.until == null
	);
}
