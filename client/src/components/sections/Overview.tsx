import image from "../../assets/dashboard.png";
export default function Overview() {
  return (
    <div className=" px-6 md:px-26 lg:px-10 xl:px-10 2xl:px-28 ">
      {" "}
      <img
        src={image}
        alt="overview"
        className="rounded-2xl w-[100%] h-auto "
      />
    </div>
  );
}
