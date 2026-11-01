"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Webcam from "react-webcam";
import axios from "axios";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { ConnectButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { getContract } from "thirdweb";
import { client } from "../client";
import { sepolia } from "thirdweb/chains";

const CONTRACT_ADDRESS = "0x7187dC71f6b48a6429256D7b0Aa4f1e86C8bCA71";

export default function SignIn() {
  const account = useActiveAccount();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [firebaseUrl, setFirebaseUrl] = useState("");
  const webcamRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [activeDeviceId, setActiveDeviceId] = useState("");

  // Initialize contract
  const contract = getContract({
    client: client,
    address: CONTRACT_ADDRESS,
    chain: sepolia,
  });

  // Check blockchain registration
  const { data: isRegistered, isLoading: isContractLoading } = useReadContract({
    contract,
    method: {
      type: "function",
      name: "isRegistered",
      inputs: [{ type: "address", name: "_user" }],
      outputs: [{ type: "bool" }],
      stateMutability: "view"
    },
    params: [account?.address]
  });

  // Camera initialization
  useEffect(() => {
    const initializeCamera = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = mediaDevices.filter(device => device.kind === "videoinput");
        setDevices(videoDevices);
        setActiveDeviceId(videoDevices[0]?.deviceId || "");
      } catch (err) {
        setCameraError(err.message || "Camera access failed");
      }
    };

    if (account && isRegistered) initializeCamera();
  }, [account, isRegistered]);

  const videoConstraints = {
    deviceId: activeDeviceId,
    facingMode: "user",
    width: { ideal: 1280 },
    height: { ideal: 720 }
  };

  const handleCapture = async () => {
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) throw new Error("Failed to capture image");

      setCapturedImage(imageSrc);
      const blob = await fetch(imageSrc).then(r => r.blob());
      const fileName = `verify-${Date.now()}-${username}.jpg`;
      const storageRef = ref(storage, `verifications/${fileName}`);
      const snapshot = await uploadBytesResumable(storageRef, blob);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      setFirebaseUrl(downloadUrl);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!username || !password) throw new Error("Please fill in all fields");
      if (!firebaseUrl) throw new Error("Please capture an image first");

      // Face verification
      const verificationResponse = await axios.post('http://localhost:8000/verify', {
        username,
        password,
        image_url: firebaseUrl
      });

      if (!verificationResponse.data.verified) {
        throw new Error("Face verification failed");
      }

      // Credential verification
      await axios.post('/api/login', {
        username,
        password,
        walletAddress: account.address
      });

      // Check blockchain registration status again
      if (!isRegistered) {
        throw new Error("Wallet not registered");
      }

      window.location.href = '/dashboard';
    } catch (error) {
      setError(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="flex min-h-screen items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-fintech-black-800 bg-black/50 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-white">
                Connect Wallet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-white">
              <p>Please connect your wallet to continue</p>
            </CardContent>
            <CardFooter className="flex flex-col">
              <ConnectButton client={client} />
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center py-24 px-4 sm:px-6 lg:px-8 hero-pattern">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-fintech-black-800 bg-black/50 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-white">
              Sign In
            </CardTitle>
            <CardDescription className="text-center">
              Blockchain Identity Verification
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 text-white">
            {isContractLoading ? (
              <div className="text-center">
                <p className="text-gray-300">Checking blockchain records...</p>
                <div className="animate-pulse h-2 bg-gray-700 rounded mt-2"></div>
              </div>
            ) : isRegistered ? (
              <form onSubmit={handleLogin}>
                <div className="space-y-6">
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-400">
                      Connected Wallet: {account.address.slice(0, 6)}...{account.address.slice(-4)}
                    </p>
                    <p className="text-green-400 text-sm mt-1">
                      ✓ Blockchain registration verified
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="johndoe"
                      className="text-black"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="text-black"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Face Verification</Label>
                    {devices.length > 1 && (
                      <select
                        value={activeDeviceId}
                        onChange={(e) => setActiveDeviceId(e.target.value)}
                        className="mb-2 w-full text-black"
                      >
                        {devices.map((device, index) => (
                          <option key={device.deviceId} value={device.deviceId}>
                            Camera {index + 1}
                          </option>
                        ))}
                      </select>
                    )}

                    <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                      {activeDeviceId ? (
                        <Webcam
                          ref={webcamRef}
                          audio={false}
                          screenshotFormat="image/jpeg"
                          videoConstraints={videoConstraints}
                          className="absolute top-0 left-0 w-full h-full object-cover"
                          mirrored
                          onUserMedia={() => setCameraReady(true)}
                          onUserMediaError={() => setCameraError("Camera access error")}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full p-4">
                          <p className="text-gray-400 text-center">
                            {cameraError || "Initializing camera..."}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                      <Button
                        type="button"
                        onClick={handleCapture}
                        disabled={!cameraReady}
                      >
                        Capture Image
                      </Button>

                      {capturedImage && (
                        <div className="mt-2">
                          <p className="text-sm mb-2">Captured Preview:</p>
                          <img
                            src={capturedImage}
                            alt="Captured"
                            className="rounded-lg border border-gray-600"
                          />
                        </div>
                      )}

                      {firebaseUrl && (
                        <div className="mt-2">
                          <p className="text-sm">Stored at:</p>
                          <a
                            href={firebaseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline break-all text-xs"
                          >
                            {firebaseUrl}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                </div>
              </form>
            ) : (
              <div className="text-center space-y-3">
                <p className="text-red-400 font-semibold">✗ Not Registered</p>
                <p className="text-xs text-gray-400">
                  This wallet has no registered identity
                </p>
                <Link href="/signup" className="w-full">
                  <Button variant="outline" className="w-full">
                    Go to Registration
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>

          {isRegistered && (
            <CardFooter className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full"
                onClick={handleLogin}
                disabled={loading || !firebaseUrl}
              >
                {loading ? "Verifying..." : "Complete Sign In"}
              </Button>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
