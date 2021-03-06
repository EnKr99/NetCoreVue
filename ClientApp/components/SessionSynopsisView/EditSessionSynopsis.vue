<template>
  <div class="section">
    <div class="columns is-centered">
      <div class="column is-narrow">
        <h1 class="title is-spaced">Update Session Synopsis</h1>

        <div class="field">
          <label for="synopsis"
                 class="label">Session Synopsis Name</label>
          <div class="control">
            <input name="synopsis"
                   :class="{ 'input': true, 'is-danger': errors.has('synopsis') }"
                   type="text"
                   :placeholder="data.sessionSynopsisName"
                   v-validate="'alpha_num_spaces|required|min:1|max:100'"
                   v-model="data.sessionSynopsisName" />
            <p v-show="errors.has('synopsis')"
               class="help is-danger">
              {{ errors.first('synopsis') }}
            </p>
          </div>
        </div>

        <b-field label="Visibility">
          <div class="field">
            <b-switch v-model="data.isVisible"
                      true-value="On"
                      false-value="Off">
              {{ isVisible }}
            </b-switch>
          </div>
        </b-field>
        <b-field grouped
                 group-multiline>
          <p class="control">
            <button type="submit"
                    class="button is-primary"
                    v-bind:class="{ 'is-loading': isLoading }"
                    :disabled="errors.any()"
                    @click="editSynopsis">
              Save
            </button>
          </p>
          <p class="control">
            <button class="button is-danger"
                    @click="cancel">
              Cancel
            </button>
          </p>
        </b-field>
      </div>
    </div>
  </div>
</template>

<script>
import { get, put } from 'axios'
import router from '../../router'

export default {
  data () {
    return {
      isLoading: false,
      data: {
        sessionSynopsisName: '',
        isVisible: 'Off'
      }
    }
  },
  async created () {
    try {
      const { data } = await get(`/api/SessionSynopsis/${this.id}`)
      this.data = data
    } catch (err) {
      console.error(err)
    }
  },
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  methods: {
    async editSynopsis () {
      this.isLoading = !this.isLoading

      try {
        const { status } = await put(`/api/SessionSynopsis/${this.id}`, {
          ...this.data,
          updatedById: this.$store.state.userId
        })

        if (status === 200) {
          this.$toast.open({
            message: 'Session Synopsis successfully updated!',
            type   : 'is-success'
          })
        }
      } catch ({ response }) {
        let message

        switch (response.status) {
          case 409:
            message = 'A session synopsis with the same name already exists.'
            break
          default:
            message = 'Failed to update Session Synopsis'
            break
        }

        this.$toast.open({ message, type: 'is-danger' })
      } finally {
        this.isLoading = !this.isLoading
      }
    },
    cancel () {
      router.go(-1)
    }
  },
  computed: {
    isVisible () {
      return this.data.isVisible === true ? 'On': 'Off'
    }
  }
}
</script>
