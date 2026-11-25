// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "StarlightBeautyStudio",
    platforms: [
        .iOS(.v16)
    ],
    products: [
        .library(
            name: "StarlightBeautyStudio",
            targets: ["StarlightBeautyStudio"]
        )
    ],
    targets: [
        .target(
            name: "StarlightBeautyStudio",
            path: "StarlightBeautyStudio",
            exclude: ["Info.plist", "StarlightBeautyStudioApp.swift"]
        )
    ]
)
