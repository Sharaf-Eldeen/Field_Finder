useEffect(() => {
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");
  const searchTerm = urlParams.get("search") || "";

  if (token) {
    localStorage.setItem("jwtToken", token);
    navigate("/"); // Redirect to home or another page after storing the token
  }

  const fetchEvents = async (pageNum) => {
    try {
      const response = await axios.get(`http://localhost:5500/api/stadiums`, {
        params: {
          page: pageNum,
          limit: itemsPerPage,
          city: searchTerm,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setEvents(response.data.stadiums);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  };

  fetchEvents(page);
}, [location, page, navigate]);
