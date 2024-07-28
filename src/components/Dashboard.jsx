// ..
import {
    Box,
    Button,
    Center,
    Flex,
    FormControl,
    FormLabel,
    Grid,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Textarea,
    Wrap,
    useColorModeValue,
    useToast,
  } from "@chakra-ui/react";
  import axios from "axios";
  
  import { useEffect, useState } from "react";
  import NoteCard from "./NoteCard";
  
  const Dashboard = () => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [showModal, setShowModal] = useState(false);
    const toast = useToast();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const getNotes = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("no token found!");
          return;
        }
        try {
          const res = await axios.get(
            "https://bahikhata-backened.onrender.com/notes",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setNotes(res.data.notes);
      
          setLoading(false);
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      };
      getNotes();
    }, [showModal]);
  
    const getNotess = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("no token found!");
        return;
      }
      try {
        const res = await axios.get(
          "https://bahikhata-backened.onrender.com/notes",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setNotes(res.data.notes);
      } catch (error) {
        console.log(error);
      }
    };
    const handleCreateNote = async (e) => {
      e.preventDefault();
      try {
        const res = await axios.post(
          "https://bahikhata-backened.onrender.com/notes",
          {
            title,
            body,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.status == 200) {
          toast({
            title: "Note created.",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        } else {
          toast({
            title: "server error",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        }
  
        setTitle("");
        setBody("");
        setShowModal(false);
      } catch (error) {
        toast({
          title: "Something went wrong! Please try again later.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        console.log(error);
        setShowModal(false);
      }
    };
  
  
    return (
      <>
        <Box>
          <Box display={"flex"} justifyContent="center">
            <Button
              p={"1rem 2rem"}
              mt={4}
              onClick={() => {
                setShowModal(true);
              }}
            >
              Add notes
            </Button>
          </Box>
          <Box width={"80%"} m={"auto"} mt={"2rem"}>
            {loading ? (
              <Box
                // border={"2px solid black"}
                display={"flex"}
                justifyContent={"center"}
              >
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
              </Box>
            ) : (
              <Grid
                templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
                gap={6}
                m={"auto"}
                justifyContent={"center"}
  
                // border={"2px solid black"}
              >
                {notes.map((note) => (
                  <NoteCard
                    key={note._id}
                    noteID={note._id}
                    title={note.title}
                    body={note.body}
                    getNotes={getNotess}
                  />
                ))}
              </Grid>
            )}
          </Box>
  
          {/*modal  */}
          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create Notes</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <FormLabel>Title:</FormLabel>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Body:</FormLabel>
                  <Textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    resize={"none"}
                  />
                </FormControl>
              </ModalBody>
  
              <ModalFooter>
                <Button colorScheme="green" mr={3} onClick={handleCreateNote}>
                  Submit
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </>
    );
  };
  
  export default Dashboard;
  