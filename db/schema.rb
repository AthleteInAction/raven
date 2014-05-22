# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140522120745) do

  create_table "comments", force: true do |t|
    t.integer  "user_id"
    t.integer  "event_id"
    t.text     "body"
    t.text     "body_html"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "contacts", force: true do |t|
    t.integer  "user_id"
    t.integer  "contact_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "events", force: true do |t|
    t.integer  "user_id"
    t.string   "title"
    t.text     "description"
    t.text     "description_html"
    t.text     "location"
    t.date     "start_date"
    t.date     "end_date"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "hashtag"
  end

  create_table "expenses", force: true do |t|
    t.integer  "event_id"
    t.integer  "price"
    t.string   "frequency"
    t.string   "description"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "invitations", force: true do |t|
    t.integer  "user_id"
    t.integer  "invitee_id"
    t.integer  "event_id"
    t.string   "start_location"
    t.string   "itype",          default: "event"
    t.string   "role"
    t.integer  "accepted",       default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "links", force: true do |t|
    t.integer  "user_id"
    t.integer  "link_id"
    t.boolean  "active",     default: true
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "name"
    t.string   "email"
    t.string   "password_digest"
    t.datetime "last_login",      default: '2014-03-23 04:52:50'
    t.boolean  "confirmed",       default: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
