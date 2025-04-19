import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  Title,
  ToggleButton,
} from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { authInstance, db } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { useSetUser } from "@/context/UserContext";
import { doc, setDoc } from "firebase/firestore";

const AuthScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useSetUser();
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // Hide header
  }, [navigation]);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Required"),
    ...(isSignUp && {
      name: Yup.string().required("Fullname is required"),
      username: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .required("Username is required"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
    }),
  });

  const handleSubmit = async (values: {
    email: string;
    password: string;
    name?: string;
    username?: string;
    phone?: string;
  }) => {
    try {
      setIsLoading(true);
      setError("");

      if (isSignUp) {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(
          authInstance,
          values.email,
          values.password
        );
        const user = userCredential.user;

        // Create user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
          name: values.name,
          email: values.email,
          username: values.username,
          phone: values.phone,
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Update local user state
        // setUser({
        //   id: user.uid,
        //   name: values.name || "",
        //   email: values.email,
        //   phone: values.phone || "",
        //   emailverified: user.emailVerified,
        //   isanonymous: user.isAnonymous,
        //   role: "user",
        //   profilePicture: "https://via.placeholder.com/150",
        // });

        setIsSignUp(false);
      } else {
        // Sign in
        const userCredential = await signInWithEmailAndPassword(
          authInstance,
          values.email,
          values.password
        );
        const user = userCredential.user;

        // Update local user state
        setUser({
          id: user.uid,
          name: user.email
            ? user.email.split("@")[0]
            : user?.displayName || "User",
          email: user.email || "",
          role: "User",
          phone: user.phoneNumber || "",
          emailverified: user.emailVerified,
          isanonymous: user.isAnonymous,
          profilePicture: user.photoURL || "https://via.placeholder.com/150",
        });

        router.replace("/(main)/(tabs)/home");
      }
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>{isSignUp ? "Sign Up" : "Sign In"}</Title>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Formik
        initialValues={{
          email: "",
          password: "",
          name: "",
          username: "",
          phone: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.form}>
            {isSignUp && (
              <>
                <TextInput
                  label="Full Name"
                  mode="outlined"
                  left={<TextInput.Icon icon="account" />}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                  error={touched.name && !!errors.name}
                  style={styles.input}
                  disabled={isLoading}
                  theme={{ colors: { primary: "#007AFF" } }}
                />
                {touched.name && errors.name && (
                  <Text style={styles.error}>{errors.name}</Text>
                )}

                <TextInput
                  label="Username"
                  mode="outlined"
                  left={<TextInput.Icon icon="at" />}
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  value={values.username}
                  error={touched.username && !!errors.username}
                  style={styles.input}
                  disabled={isLoading}
                  theme={{ colors: { primary: "#007AFF" } }}
                />
                {touched.username && errors.username && (
                  <Text style={styles.error}>{errors.username}</Text>
                )}

                <TextInput
                  label="Phone"
                  mode="outlined"
                  left={<TextInput.Icon icon="phone" />}
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  value={values.phone}
                  error={touched.phone && !!errors.phone}
                  keyboardType="phone-pad"
                  style={styles.input}
                  disabled={isLoading}
                  theme={{ colors: { primary: "#007AFF" } }}
                />
                {touched.phone && errors.phone && (
                  <Text style={styles.error}>{errors.phone}</Text>
                )}
              </>
            )}

            <TextInput
              label="Email"
              mode="outlined"
              left={<TextInput.Icon icon="email" />}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              error={touched.email && !!errors.email}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              disabled={isLoading}
              theme={{ colors: { primary: "#007AFF" } }}
            />
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}

            <TextInput
              label="Password"
              mode="outlined"
              left={<TextInput.Icon icon="lock" />}
              secureTextEntry
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              error={touched.password && !!errors.password}
              style={styles.input}
              disabled={isLoading}
              theme={{ colors: { primary: "#007AFF" } }}
            />
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            <Button
              mode="contained"
              onPress={() => handleSubmit()}
              style={styles.button}
              disabled={isLoading}
              loading={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : isSignUp ? (
                "Sign Up"
              ) : (
                "Sign In"
              )}
            </Button>

            <ToggleButton
              icon={isSignUp ? "account-arrow-left" : "account-plus"}
              onPress={() => setIsSignUp(!isSignUp)}
              style={styles.toggleButton}
              disabled={isLoading}
            />
            <Text style={styles.toggleText}>
              {isSignUp
                ? "Already have an account? Sign In"
                : "Need an account? Sign Up"}
            </Text>
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  form: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  toggleButton: {
    alignSelf: "center",
    marginTop: 20,
  },
  toggleText: {
    textAlign: "center",
    marginTop: 10,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});

export default AuthScreen;
