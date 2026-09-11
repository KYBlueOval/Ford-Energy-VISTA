plugins {
    id("com.android.application")
}

android {
    namespace = "com.fordenergy.vista"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.fordenergy.vista"
        minSdk = 26
        targetSdk = 36
        versionCode = 27100
        versionName = "2.7.1"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

dependencies {
    implementation("androidx.core:core:1.17.0")
    implementation("androidx.activity:activity:1.11.0")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.material:material:1.12.0")
}
