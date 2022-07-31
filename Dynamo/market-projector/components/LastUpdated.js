import dayjs from "dayjs";

export default function LastUpdated({ last_update }) {
  return <div style={{
    position: "fixed",
    top: "72%",
    left: "0px",
    transformOrigin: "top left",
    transform: "rotateZ(-90deg) translateX(50%) translateY(0px)",
    boxShadow: "0 1px 10px 0 rgb(0 0 0 / 10%)",
    backgroundColor: "#fff",
    float: "right",
    padding: "2px 16px",
    marginBottom: "15px",
    border: "1px solid #ecedef"
  }} className="text-muted font-weight-bold">
    Last Updated: { dayjs(last_update).format("MMM DD, HH:mm a") }
  </div>
}
