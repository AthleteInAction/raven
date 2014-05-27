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

  		def tag

  			http = Net::HTTP.new('api.instagram.com',443)
  			req = Net::HTTP::Get.new(URI.escape("/v1/tags/#{params[:hashtag]}/media/recent?access_token=#{current_user.instagram_token}"))
  			http.verify_mode = OpenSSL::SSL::VERIFY_NONE
  			http.use_ssl = true
  			req.content_type = 'application/json'
  			response = http.request(req)
  			code = response.code
  			body = response.body
  			
  			final = {:code => code.to_f.round,:body => JSON.parse(body)}

  			render json: final

  		end


      def check

        @user = User.find current_user.id

        http = Net::HTTP.new('api.instagram.com',443)
        req = Net::HTTP::Get.new(URI.escape("/oauth/authorize?client_id=066491d54faf4644bc92586ba4b7953c&redirect_uri=http://localhost:3000/api/v1/instagram/verify&response_type=code"))
        http.verify_mode = OpenSSL::SSL::VERIFY_NONE
        http.use_ssl = true
        response = http.request(req)
        code = response.code
        body = response.body

        render json: {code: code,body: body}

      end


      def verify

        @final = {code: 999,error: 'There was an error'}

        if params[:type] == 'new' && params[:code]

          http = Net::HTTP.new 'api.instagram.com',443
          http.verify_mode = OpenSSL::SSL::VERIFY_NONE
          http.use_ssl = true

          uri = URI.escape '/oauth/access_token'

          req = Net::HTTP::Post.new uri

          payload = {
            client_id: INFRA[:instagram][:client_id],
            client_secret: INFRA[:instagram][:client_secret],
            grant_type: 'authorization_code',
            redirect_uri: "#{INFRA[:instagram][:redirect_uri]}?type=new",
            code: params[:code]
          }

          req.set_form_data payload

          response = http.request req
          body = JSON.parse response.body
          code = response.code.to_f.round

          @user = User.find_by_instagram_id body['user']['id'].to_f.round+999

          if @user

            session[:user_id] = @user.id
            render 'shell',layout: false

          else

            @user = User.new name: body['user']['full_name'],instagram_id: body['user']['id'],instagram_verified: true,instagram_token: body['access_token'],profile_pic: body['user']['profile_picture'],password: 'instagram',confirmed: true
            if @user.save
              
              session[:user_id] = @user.id
              render 'shell',layout: false

            else
              
              render json: @user.errors

            end

          end

        end

        if params[:type] == 'verify' && params[:code]

          http = Net::HTTP.new 'api.instagram.com',443
          http.verify_mode = OpenSSL::SSL::VERIFY_NONE
          http.use_ssl = true

          uri = URI.escape '/oauth/access_token'

          req = Net::HTTP::Post.new uri

          payload = {
            client_id: INFRA[:instagram][:client_id],
            client_secret: INFRA[:instagram][:client_secret],
            grant_type: 'authorization_code',
            redirect_uri: "#{INFRA[:instagram][:redirect_uri]}?type=verify",
            code: params[:code]
          }

          req.set_form_data payload

          response = http.request req
          body = JSON.parse response.body
          code = response.code.to_f.round

          current_user.update_attributes instagram_id: body['user']['id'],instagram_verified: true,instagram_token: body['access_token'],profile_pic: body['user']['profile_picture']

          render 'shell',layout: false

        end

        # Get Current User
        # :-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-
        # :-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-
        #@user = User.find current_user.id
        # :-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-
        # :-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-

        #render 'shell',layout: false
        #render json: {final: @final,params: params}

      end


  		def verify1

        @user = User.find current_user.id

        uri = URI.parse('https://api.instagram.com/oauth/access_token')
        payload = {
          client_id: INFRA[:instagram][:client_id],
          client_secret: INFRA[:instagram][:client_secret],
          grant_type: 'authorization_code',
          redirect_uri: "#{INFRA[:instagram][:redirect_uri]}?type=verify",
          code: params[:code]
        }
        response = Net::HTTP.post_form(uri,payload)
        body = JSON.parse(response.body)
        code = response.code.to_f.round

        @user.update_attributes instagram_id: body['user']['id'],instagram_verified: true,instagram_token: body['access_token'],profile_pic: body['user']['profile_picture']

        render 'shell',layout: false

  			if params[:code]

  				@user = User.find current_user.id
  				uri = URI.parse('https://api.instagram.com/oauth/access_token')
  				payload = {
  					client_id: '066491d54faf4644bc92586ba4b7953c',
  					client_secret: 'a24f1c31b6044abcba0bf359fb3aaebf',
  					grant_type: 'authorization_code',
  					redirect_uri: 'http://localhost:3000/api/v1/instagram/verify',
  					code: params[:code]
  				}
  				response = Net::HTTP.post_form(uri,payload)
  				body = JSON.parse(response.body)
  				code = response.code.to_f.round

  				instagram_token = body['access_token']

  				if code == 200

  					a = Time.now.to_f
  					http = Net::HTTP.new('api.instagram.com',443)
  					req = Net::HTTP::Get.new(URI.escape("/v1/users/self?access_token=#{instagram_token}"))
  					http.verify_mode = OpenSSL::SSL::VERIFY_NONE
  					http.use_ssl = true
  					req.content_type = 'application/json'
  					response = http.request(req)
  					code = response.code
  					body = response.body
  					b = Time.now.to_f
  					c = ((b-a)*100).round.to_f/100
  					
  					final = {:code => code.to_f.round,:body => JSON.parse(body),time: c}

  					@user.update_attributes(instagram_token: instagram_token,instagram_id: final[:body]['data']['id'],instagram_verified: true)

  					render json: final

  				end

  			end

  			#render json: {params: params,user: @user}

  		end

  		def token

  			@user = User.find current_user.id

  			# https://api.instagram.com/oauth/access_token
  			a = Time.now.to_f
  			http = Net::HTTP.new('api.instagram.com',443)
  			req = Net::HTTP::Get.new(URI.escape("/v1/users/self?access_token=#{@user.instagram_token}"))
  			http.verify_mode = OpenSSL::SSL::VERIFY_NONE
  			http.use_ssl = true
  			req.content_type = 'application/json'
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