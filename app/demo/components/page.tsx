import {ComponentShowcase} from "@/components/design-system/preview/component-showcase"
import {notFound} from "next/navigation"
/** Development/demo-only route; intentionally absent from product navigation. */
export default function ComponentShowcasePage(){if(process.env.NODE_ENV==="production")notFound();return <ComponentShowcase/>}
