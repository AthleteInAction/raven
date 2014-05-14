module Api
  module V1
  	class InstagramController < ApplicationController

  		# Includes
  		#-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:
  		require 'json'
  		require 'net/http'
  		require 'net/https'
  		require 'uri'
  		#-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:

  		def index

  			# https://api.instagram.com/v1/tags/nofilter?access_token=26101403.f59def8.77dcd553fdc54db594bfadd1c7d61161
  			# https://api.instagram.com/v1/tags/nofilter/media/recent?client_id=066491d54faf4644bc92586ba4b7953c

  			a = Time.now.to_f
  			http = Net::HTTP.new('api.instagram.com',443)
  			req = Net::HTTP::Get.new(URI.escape("/v1/tags/#{params[:hashtag]}/media/recent?client_id=066491d54faf4644bc92586ba4b7953c"))
  			http.verify_mode = OpenSSL::SSL::VERIFY_NONE
  			http.use_ssl = true
  			req.content_type = 'application/json'
  			req.basic_auth @username,@password
  			response = http.request(req)
  			code = response.code
  			body = response.body
  			b = Time.now.to_f
  			c = ((b-a)*100).round.to_f/100
  			
  			final = {:code => code.to_f.round,:body => JSON.parse(body),time: c}

  			render json: final

  		end
  		
  	end
  end
end