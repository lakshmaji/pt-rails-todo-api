# frozen_string_literal: true

# adds pagination meta
class PaginationSerializer
  include JSONAPI::Serializer

  attr_reader :collection, :total_count

  def initialize(collection, total_count:)
    @collection = collection
    @total_count = total_count
  end

  def serializable_hash
    {
      data: collection.map { |item| TaskSerializer.new(item).serializable_hash[:data] },
      meta: {
        total_count:,
        current_page: collection.current_page,
        total_pages: collection.total_pages,
        next_page: collection.next_page,
        prev_page: collection.prev_page,
        per_page: collection.limit_value
      }
    }
  end
end
