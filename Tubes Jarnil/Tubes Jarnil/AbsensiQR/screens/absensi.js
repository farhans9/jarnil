import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Linking } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useSelector } from "react-redux";

const Absensi = () => {
  const { nim, nama } = useSelector((state) => state.profile); // useSelector should be used inside the component

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    // Mengecek apakah data barcode sesuai dengan pola yang diinginkan
    if (data.includes("http://10.217.19.211/img/post.php?")) {
      // Menyiapkan data untuk dikirim ke server
      const url = data + `&nim=${nim}&nama=${nama}`;
      
  
      try {
        const response = await fetch(url, {
          method: 'POST',
        });
  
        if (response.ok) {
          alert(`Absensi berhasil dilakukan.`);
        }
      } catch (error) {
        // Tangani kesalahan jika ada
        console.error('Error:', error);
        alert(`An error occurred while processing the request.`);
      }
    } else {
      // Tampilkan pesan bahwa data barcode tidak sesuai dengan yang diharapkan
      alert(`Bar code with data ${data} does not match the expected pattern.`);
    }
  };  

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} style={styles.camera} />
      </View>
    );
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission not granted</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}></Text>
      <Text style={styles.title}>Scan a barcode </Text>
      {renderCamera()}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setScanned(false);
        }}
      >
        <Text style={styles.buttonText}>Scan Ulang</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Absensi;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 40,
  },
  cameraContainer: {
    width: "80%",
    aspectRatio: 1,
    overflow: "hidden",
    borderRadius: 10,
    marginBottom: 40,
  },
  camera: {
    flex: 1,
  },
  button: {
    backgroundColor: "blue",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
