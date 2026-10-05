import {PatternShowcase} from "@/components/patterns/preview/pattern-showcase"
import {notFound} from "next/navigation"
export default function PatternsPage(){if(process.env.NODE_ENV==="production")notFound();return <PatternShowcase/>}
