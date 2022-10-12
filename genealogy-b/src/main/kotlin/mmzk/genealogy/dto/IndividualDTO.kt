package mmzk.genealogy.dto

import kotlinx.serialization.Serializable
import mmzk.genealogy.dao.Individual

@Serializable
data class IndividualDTO(
    var id: Int,
    var name: String,
    var dateOfBirth: String?,
    var dateOfDeath: String?,
    var placeOfBirth: String?,
    var placeOfDeath: String?,
    var gender: Char,
) {
    constructor(x: Individual): this(
        x.id.value,
        x.name,
        x.dateOfBirth?.toLocalDate().toString(),
        x.dateOfDeath?.toLocalDate().toString(),
        x.placeOfBirth,
        x.placeOfDeath,
        x.gender
    )
}
