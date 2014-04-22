class TemplatesController < ApplicationController
	def load_template

		render params[:template],layout: false

	end
end