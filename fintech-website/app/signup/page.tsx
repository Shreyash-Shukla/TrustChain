"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Webcam from "react-webcam";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import axios from "axios";
import { ConnectButton, useActiveAccount, TransactionButton, lightTheme } from "thirdweb/react";
import { getContract, prepareContractCall } from "thirdweb";
import { client } from "../client";
import { sepolia } from "thirdweb/chains";

const CONTRACT_ADDRESS = "0x7187dC71f6b48a6429256D7b0Aa4f1e86C8bCA71";

export default function SignUp() {
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
  const account = useActiveAccount();

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

    if (account) initializeCamera();
  }, [account]);

  const contract = getContract({
    client: client,
    address: CONTRACT_ADDRESS,
    chain: sepolia,
  });

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
      const fileName = `registration-${Date.now()}-${username}.jpg`;
      const storageRef = ref(storage, `registrations/${fileName}`);
      const snapshot = await uploadBytesResumable(storageRef, blob);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      setFirebaseUrl(downloadUrl);
    } catch (error) {
      setError(error.message);
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
              <p>Please connect your wallet to sign up.</p>
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
              Sign Up
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-white">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  className="text-black"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  minLength={3}
                  maxLength={32}
                  pattern="[a-zA-Z0-9_]+"
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
                  minLength={8}
                  maxLength={128}
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

                <div className="flex flex-col gap-2">
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
              {error && <div className="text-red-500 text-sm">{error}</div>}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <TransactionButton
              theme={lightTheme()}
              transaction={async () =>
                prepareContractCall({
                  contract: contract,
                  method: {
                    type: "function",
                    name: "registerUser",
                    inputs: [{ type: "string", name: "_username" }],
                    outputs: [],
                    stateMutability: "nonpayable"
                  },
                  params: [username]
                })
              }
              onTransactionConfirmed={async () => {
                try {
                  const registrationResponse = await axios.post('http://localhost:8000/register', {
                    username,
                    password,
                    image_url: firebaseUrl
                  });
                  if (registrationResponse.data?.message !== 'User registered successfully') {
                    throw new Error('Face registration failed. Your wallet may already be registered; contact support.');
                  }
                  // Save to MongoDB
                  await axios.post('/api/signup', {
                    username,
                    password,
                    image_url: firebaseUrl,
                    walletAddress: account.address
                  });
                  window.location.href = '/signin';
                } catch (error) {
                  setError(error.message);
                }
              }}
              onError={(error) => setError(`Blockchain error: ${error.message}`)}
              className="w-full"
              disabled={!/^[a-zA-Z0-9_]{3,32}$/.test(username.trim()) || password.length < 8 || password.length > 128 || !firebaseUrl}
            >
              Complete Sign Up
            </TransactionButton>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/signin" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
