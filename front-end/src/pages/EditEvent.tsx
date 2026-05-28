import { motion } from "framer-motion";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import Input from "../components/UI/Input";
import Textarea from "../components/UI/Teaxtarea";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";

import { useAuth } from "../context/AuthContext";

interface EventItem {
  id: number;

  title: string;

  description: string;

  start_date: string;

  end_date: string;

  location: string;

  category: string;

  venue_name: string;

  venue_address: string;
}

export default function EditEvent() {
  const navigate = useNavigate();

  const { id } = useParams();

  const { token } = useAuth();

  const [loading, setLoading] =
    useState(false);

  const [event, setEvent] =
    useState<EventItem>({
      id: Number(id),

      title: "",

      description: "",

      start_date: "",

      end_date: "",

      location: "",

      category: "",

      venue_name: "",

      venue_address: "",
    });

  /////////////////////////////////////////////////////
  // FETCH EVENT
  /////////////////////////////////////////////////////

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const response =
        await axios.get(
          `http://localhost:5000/events/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const data =
        response.data.data;

      setEvent({
        ...data,

        start_date:
          data.start_date?.split(
            "T"
          )[0],

        end_date:
          data.end_date?.split(
            "T"
          )[0],
      });
    } catch (error) {
      console.error(error);

      alert(
        "Failed to fetch event"
      );
    }
  };

  /////////////////////////////////////////////////////
  // HANDLE CHANGE
  /////////////////////////////////////////////////////

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } =
      e.target;

    setEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /////////////////////////////////////////////////////
  // HANDLE SUBMIT
  /////////////////////////////////////////////////////

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.patch(
        `http://localhost:5000/events/${id}`,
        event,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        "Event updated successfully"
      );

      navigate("/my-events");
    } catch (error) {
      console.error(error);

      alert(
        "Failed to update event"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-blue-50 overflow-hidden font-sans">
      {/* Header */}
      <section className="flex flex-col items-center pt-16 pb-8 px-6 text-center">
        <motion.h1
          initial={{
            y: -40,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          className="text-4xl font-extrabold text-blue-900"
        >
          Edit Your Event
        </motion.h1>

        <motion.p
          initial={{
            y: 20,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          className="text-blue-800 max-w-2xl mt-4"
        >
          Update your event
          details below.
        </motion.p>
      </section>

      {/* Form */}
      <section className="px-6 pb-20 flex justify-center">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="w-full max-w-2xl"
        >
          <Card>
            <form
              onSubmit={
                handleSubmit
              }
              className="p-8 space-y-6"
            >
              {/* Title */}
              <Input
                label="Event Title"
                name="title"
                value={event.title}
                onChange={
                  handleChange
                }
                placeholder="Enter event title"
                required
              />

              {/* Description */}
              <Textarea
                label="Description"
                name="description"
                value={
                  event.description
                }
                onChange={
                  handleChange
                }
                rows={4}
                placeholder="Describe your event"
                required
              />

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  name="start_date"
                  value={
                    event.start_date
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

                <Input
                  label="End Date"
                  type="date"
                  name="end_date"
                  value={
                    event.end_date
                  }
                  onChange={
                    handleChange
                  }
                  required
                />
              </div>

              {/* Location */}
              <Input
                label="Location"
                name="location"
                value={
                  event.location
                }
                onChange={
                  handleChange
                }
                placeholder="City / Area"
                required
              />

              {/* Category */}
              <Input
                label="Category"
                name="category"
                value={
                  event.category
                }
                onChange={
                  handleChange
                }
                placeholder="Music / Tech / Food"
                required
              />

              {/* Venue */}
              <Input
                label="Venue Name"
                name="venue_name"
                value={
                  event.venue_name
                }
                onChange={
                  handleChange
                }
                placeholder="Venue name"
                required
              />

              {/* Address */}
              <Textarea
                label="Venue Address"
                name="venue_address"
                value={
                  event.venue_address
                }
                onChange={
                  handleChange
                }
                rows={3}
                placeholder="Full address"
                required
              />

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    navigate(
                      "/my-events"
                    )
                  }
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                >
                  {loading
                    ? "Saving..."
                    : "Save Changes"}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}