// Locale-aware exports (Spanish)
export { store as storeEs, categoryBadge } from "./store.es";
export { ui as uiEs } from "./ui.es";
export { blog as blogEs } from "./blog.es";
export { agenda as agendaEs, dayNames, dayList } from "./agenda.es";
export { paginas as paginasEs } from "./paginas.es";
export { form as formEs } from "./form.es";

// Locale-aware exports (English)
export { store as storeEn } from "./store.en";
export { ui as uiEn } from "./ui.en";
export { blog as blogEn } from "./blog.en";
export {
  agenda as agendaEn,
  dayList as dayListEn,
  dayNames as dayNamesEn,
} from "./agenda.en";
export { paginas as paginasEn } from "./paginas.en";
export { form as formEn } from "./form.en";

// Locale-neutral exports (data)
export { brand } from "../data/brand.es";
export { nav } from "../data/nav.es";
export { home } from "../data/home.es";
export { pages } from "../data/contact.es";

// Backward compatible exports (defaults to Spanish)
export { store } from "./store.es";
export { ui } from "./ui.es";
export { blog } from "./blog.es";
export { agenda } from "./agenda.es";
export { paginas } from "./paginas.es";
export { form } from "./form.es";
