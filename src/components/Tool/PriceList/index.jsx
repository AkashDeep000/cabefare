import prices from "@/utils/prices"
import PriceCard from "./PriceCard"
export default function PriceList ( {
  distance, isNight, person
}) {
  return (
    <div className="mt-6">
      <p className="text-gray-900 font-semibold mb-3">
Estimated price
    </p>
    <div className="grid gap-3">
    {
      prices.map((e) => {
        return (
          <PriceCard key={e.id} props={e} distance={distance} isNight={isNight} person={person} />

        )
      })
      }
    </div>
    </div>
  )
}