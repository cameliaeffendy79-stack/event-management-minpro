type Props = {
  event: any;
  onClick: () => void;
};

function EventCard({ event, onClick }: Props) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID").format(price);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "20px",
        cursor: "pointer",
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
      }}
    >
      <h2 style={{ color: "#111" }}>{event.title}</h2>
      <p>📍 {event.location}</p>
      <p>
        📅 {formatDate(event.start_date)} -{" "}
        {formatDate(event.end_date)}
      </p>
      <p>Rp {formatPrice(event.price)}</p>
    </div>
  );
}

export default EventCard;