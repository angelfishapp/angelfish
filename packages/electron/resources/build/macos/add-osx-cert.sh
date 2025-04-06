#!/usr/bin/env sh

KEY_CHAIN=build.keychain
CERTIFICATE_P12=certificate.p12
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Recreate the certificate from the secure environment variable
echo $CERTIFICATE_OSX_APPLICATION | base64 --decode > $CERTIFICATE_P12

#create a keychain
security create-keychain -p actions $KEY_CHAIN

# Make the keychain the default so identities are found
security default-keychain -s $KEY_CHAIN

# Unlock the keychain
security unlock-keychain -p actions $KEY_CHAIN

# Import the Apple Developer certificate to ensure the certificates are trusted
echo "Importing $SCRIPT_DIR/DeveloperIDG2CA.cer certificate..."
security import $SCRIPT_DIR/DeveloperIDG2CA.cer -k $KEY_CHAIN -T /usr/bin/codesign

# Import the certificates
security import $CERTIFICATE_P12 -k $KEY_CHAIN -P $CERTIFICATE_OSX_PASSWORD -T /usr/bin/codesign;

security set-key-partition-list -S apple-tool:,apple: -s -k actions $KEY_CHAIN

# List identities
echo "Listing identities..."
security find-identity -p codesigning -v

# remove certs
rm -fr *.p12