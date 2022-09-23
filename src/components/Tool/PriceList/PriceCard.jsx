export default function PriceCard ( {
  props, distance, basePrice, perKmPrice, isNight, person
}) {
  const calTotalCost = ({
    distance, basePrice, perKmPrice, isNight, person
  }) => {
    const nightExtra = 1.25

    const extraDistance = (distance <= 1000) ? 0: ((distance - 1000) / 1000)
    console.log(distance, extraDistance)
    let total = (basePrice + (extraDistance * perKmPrice)) * person

      if (isNight === true) {
        total = (total * nightExtra)
      }

      return total.toFixed(1)
    }
    const totalCost = calTotalCost({
      distance,
      basePrice: props.basePrice,
      perKmPrice: props.perKmPrice,
      isNight,
      person
    })

    return (
      <div className="px-4 py-2 bg-white shadow-sm grid grid-cols-[auto_1fr_auto] place-items-center gap-4">
    <img className="w-16 h-16" src={props.img} />
    <div className="w-full">
      <p className="">
  {props.name}
      </p>
    <p className="text-xs">
  {props.description}
      </p>
    <div className="mt-2 flex">
    <p className="text-sm pr-4">
  {"base price: "}{props.basePrice}
        </p>
    <p className="text-sm">
    {"per km: "}{props.perKmPrice}
        </p>
      </div>
      </div>
  <p className="text-2xl font-ubuntu">
  ₹{totalCost}
      </p>
    </div>
  )
}