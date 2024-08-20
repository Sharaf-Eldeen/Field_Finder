import axios from "axios";

const EventList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTerm = urlParams.get("search") || "";

    const fetchEvents = async (pageNum) => {
      try {
        const response = await axios.get(`http://localhost:5500/api/stadiums`, {
          params: {
            page: pageNum,
            limit: itemsPerPage,
            city: searchTerm,
          },
        });
        setEvents(response.data.stadiums);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };

    fetchEvents(page);
  }, [location, page]);

  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <section style={{ margin: "auto", width: "97%" }}>
      <Box
        sx={{
          flexGrow: 1,
          padding: "2%",
          paddingLeft: "5%",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "5%",
          maxWidth: "100%",
        }}
      >
        <Grid container spacing={2}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <EventCard
                slug={event.slug}
                images={event.images}
                location={event.city}
                stadium={event.name}
                price={event.pricePerHour}
                details={event.details}
                phone={event.ownerPhone}
                gps={event.location}
              />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChange}
            color="success"
          />
        </Box>
      </Box>
    </section>
  );
};

export default EventList;
