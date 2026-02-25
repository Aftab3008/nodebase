import { routeLabels } from "@/constants";

export function getPageTitle(pathname: string): string {
  for (const [route, label] of Object.entries(routeLabels)) {
    if (pathname.startsWith(route)) return label;
  }
  return "Dashboard";
}
