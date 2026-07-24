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
        versionCode = 23700
        versionName = "2.3.7"
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
}
