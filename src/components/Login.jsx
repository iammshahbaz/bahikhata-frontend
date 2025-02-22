import {
    Box,
    Button,
    Container,
    FormControl,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
  } from "@chakra-ui/react";
  import axios from "axios";
  
  import React, { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { useNavigate } from "react-router";
  import { authLinLout } from "../redux/authSlice";
  import { Link } from "react-router-dom";
  
  const Login = () => {
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth.auth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log(` ${password}  , ${email}`);
      try {
        const response = await axios.post(
          "https://bahikhata-backened.onrender.com/users/login",
          {
            email,
            password,
          }
        );
  
        // console.log(response);
        if (response.status === 200) {
          const token = response.data.token;
  
          // console.log(">>>>>>>>>", auth);
          localStorage.setItem("token", token); // Set token in local storage
          setShowModal(true);
          setModalMessage("Login successful");
          dispatch(authLinLout(true));
          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);
        } else {
          console.error("Login failed");
        }
      } catch (error) {
        setShowModal(true);
        setModalMessage("Please register yourself");
        console.error("Error:", error);
      }
    };
    const closeModal = () => {
      setShowModal(false);
      if (modalMessage === "Login successful") {
        navigate("/notes");
      }
    };
    return (
      <div className="bg-[#7f7b7b] flex h-[38rem] items-center">
        <Container>
          <Box
            p={"2rem"}
            bg={"white"}
            borderRadius={10}
            boxShadow={"0px 9px 88px -1px rgba(157,159,119,0.89)"}
          >
            <form onSubmit={handleSubmit}>
              <Heading as={"h1"} color={"green"} textAlign={"center"} mb={4}>
                Login
              </Heading>
              <FormControl>
                <Stack spacing={5}>
                  <Input
                    type="email"
                    placeholder="Email"
                    border={"1px solid gray"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    border={"1px solid gray"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button type="submit" colorScheme="green" width="full">
                    Login
                  </Button>
  
                  <Text textAlign={"center"}>
                    Don't have an account{" "}
                    <Text as={Link} to="/signup" color="green" fontWeight="bold">
                      Signup
                    </Text>
                  </Text>
                </Stack>
              </FormControl>
            </form>
          </Box>
          <Modal isOpen={showModal} onClose={closeModal}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Login Status</ModalHeader>
              <ModalBody>{modalMessage}</ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" onClick={closeModal}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Container>
      </div>
    );
  };
  
  export default Login;
  
  