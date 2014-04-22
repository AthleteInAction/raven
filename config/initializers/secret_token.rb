# Be sure to restart your server when you modify this file.

# Your secret key is used for verifying the integrity of signed cookies.
# If you change this key, all old signed cookies will become invalid!

# Make sure the secret is at least 30 characters and all random,
# no regular words or you'll be exposed to dictionary attacks.
# You can use `rake secret` to generate a secure secret key.

# Make sure your secret_key_base is kept private
# if you're sharing your code publicly.
Raven::Application.config.secret_key_base = '7e5367e9a51f8e9702fb5595ee49627ab50fa6d0bcfc263c2519abfe4a2af76c69c06f592b6935073fceae2f043767a6d029d284ffd77602e0e9e0caed30cb6a'
